from django.shortcuts import render
# from django.http import JsonResponse
# from .product import products
from .models import Product,Order,OrderItem,ShippingAddress
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes,permission_classes
from .serializer import ProductSerializer,OrderSerializer,UserSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from .serializer import UserSerializerWithToken
from django.shortcuts import get_object_or_404

#for email purpose and cerifying the email
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_text,DjangoUnicodeDecodeError
from django.core.mail import EmailMessage
from django.conf import settings
from django.views.generic import View
from .utils import TokenGenerator,generate_token
from rest_framework.permissions import AllowAny, IsAuthenticated,IsAdminUser
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication

# Create your views here.
@api_view(['GET'])
def getRoutes(request):
    myapis=[
        {
            "products":'http://127.0.0.1:8000/api/products',
            "product":'http://127.0.0.1:8000/api/products/1',
            "login":'http://127.0.0.1:8000/api/users/login',
            "signup":'http://127.0.0.1:8000/api/users/register'
        }
    ]
    return Response(myapis)

@api_view(['GET'])
@permission_classes([AllowAny])
def getProducts(request):
    products = Product.objects.all()
    serialize = ProductSerializer(products, many=True)
    return Response(serialize.data)

@api_view(['GET'])
@permission_classes([AllowAny])
@authentication_classes([])
def getProduct(request, id):
    product = Product.objects.get(_id=id)
    serialize=ProductSerializer(product,many=False)
    return Response(serialize.data)




class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # attrs['username'] = attrs.get('username')
        data = super().validate(attrs)

        user = self.user

        return {
            'refresh': data['refresh'],
            'access': data['access'],
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'isAdmin': user.is_staff,
        }


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer



@api_view(['POST'])
def registerUser(request):
    data=request.data
    try:
        if User.objects.filter(username=data.get('email')).exists():
         return Response({'detail': 'User already exists with this email'})
        user=User.objects.create(
            username=data.get('email'),  
            first_name=data.get('first_name'),  
            last_name=data.get('last_name'),
            email=data.get('email'),
            password=make_password(data.get('password')),is_active=True)
        email_subject="Activate Your Account"
        message=render_to_string(
            "activate.html",{
                "user":user,
                "domain":'127.0.0.1:8000',
                'uid':urlsafe_base64_encode(force_bytes(user.pk)),
                'token':generate_token.make_token(user)
            }
        )

        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)

        # email_message=EmailMessage(email_subject,message,settings.EMAIL_HOST_USER,[data['email']])
        # email_message.send()
        message={'details':f'Activate your account please check click the link in gmail for account activation{message}'}
        return Response(message)
    
    except Exception as e:
         message = {'detail': f'Signup is failed: {str(e)}'}
         return Response(message)   


class ActivateAccountView(View):

    def get(self,request,uidb64,token):
        try:
            uid=force_text(urlsafe_base64_decode(uidb64))
            user=User.objects.get(pk=uid)
        except Exception as identifier:
            user=None

        if user is not None and generate_token.check_token(user,token):
            user.is_active=True
            user.save()
            return render(request,"activatesuccess.html")
        else:
            return render(request,"activatefail.html")        

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user=request.user
    data=request.data
    OrderItems=data['orderItems']
    if OrderItems and len(OrderItems)==0:
        return Response({'details':"No Order Items"},status=status.HTTP_400_BAD_REQUEST)

    #1. Create Order
    order=Order.objects.create(
        user=user,
        paymentMethod=data['paymentMethod'],
        taxPrice=data['taxPrice'],
        shippingPrice=data['shippingPrice'],
        totalPrice=data['totalPrice']
    )

    #2.shipping Address
    Shipping=ShippingAddress.objects.create(
        order=order,
        address=data['shippingAddress']['address'],
        city=data['shippingAddress']['city'],
        postalCode=data['shippingAddress']['postalCode'],
        country=data['shippingAddress']['country']
    )
   

    #3.Create order items and set order-orderitem relationship
    print(OrderItems)
    for i in OrderItems:
        product=Product.objects.get(_id=i['product'])
        item=OrderItem.objects.create(
            product=product,
            order=order,
            name=product.name,
            qty=i['qty'],
            price=i['price'],
            image=product.image.url
        )

        # update the stock

        product.countInStock -= item.qty
        product.save()

    serializer = OrderSerializer(order, many=False)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    user=request.user
    orders=user.order_set.all()
    serializer=OrderSerializer(orders,many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getOrders(request):
    Orders=Order.objects.all()
    serializer=OrderSerializer(Orders,many=True)
    return Response(serializer.data)

    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request,pk):
    user=request.user

    try:
        order=Order.objects.get(_id=pk)
        if user.is_staff or order.user==user:
            serializer=OrderSerializer(order,many=False)
            return Response(serializer.data)
        else:
            return Response({'details':"Not authorized to view this order"},status=status.HTTP_400_BAD_REQUEST)        
    except:
        return Response({
            'details':'Order does not exist'
        },status=status.HTTP_400_BAD_REQUEST)


#admin views
@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(request):
    user=request.user

    product=Product.objects.create(
        user=user,
        name='Sample Name',
        price=0,
        brand='Sample Brand',
        countInStock=0,
        category='Sample Category',
        description=''
    )
    serailizer=ProductSerializer(product,many=False)
    return Response(serailizer.data)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request,pk):
    data=request.data
    product = get_object_or_404(Product, _id=pk)
    product.name = data.get('name', product.name)
    product.price = data.get('price', product.price)
    product.image = data.get('image', product.image)
    product.brand = data.get('brand', product.brand)
    product.category = data.get('category', product.category)
    product.countInStock = data.get('countInStock', product.countInStock)
    product.description = data.get('description', product.description)
    product.save()
    serailizer=ProductSerializer(product,many=False)
    return Response(serailizer.data)

@api_view(['POST'])
def uploadImage(request):
    data=request.data
    product_id=data['product_id']
    product=Product.objects.get(_id=product_id)
    product.image=request.FILES.get('image')
    product.save()
    return Response('Image was Uploaded')


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(request,pk):
    product=Product.objects.get(_id=pk)
    product.delete()
    return Response('Product Deleted...')


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users=User.objects.all()
    serializer=UserSerializer(users,many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserById(request,pk):
    user=User.objects.get(id=pk)
    serializer=UserSerializer(user,many=False)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user=request.user
    serializer=UserSerializer(user,many=False)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    user = request.user
    data = request.data

    user.first_name = data.get('first_name', user.first_name)
    user.last_name = data.get('last_name', user.last_name)
    user.email = data.get('email', user.email)

    if data.get('password'):
        user.set_password(data.get('password'))

    user.save()

    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)



@api_view(['DELETE'])
# @permission_classes([IsAuthenticated])
def deleteUser(request,pk):
    user=User.objects.get(id=pk)
    user.delete()
    return Response("User is Deleted...")

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateUser(request,pk):
    user=User.objects.get(id=pk)
    data=request.data

    user.first_name = data.get('first_name', user.first_name)
    user.email=data['email']
    user.is_staff=data['isAdmin']
    user.save()
    serializer=UserSerializer(user,many=False)
    return Response(serializer.data)


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }