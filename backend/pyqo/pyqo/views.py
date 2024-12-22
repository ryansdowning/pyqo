from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework import serializers

from rest_framework.authtoken.views import ObtainAuthToken as BaseObtainAuthToken
from rest_framework.response import Response

class ObtainAuthToken(BaseObtainAuthToken):
    authentication_classes = []  # Disable global authentication for this view

    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class TokenValidateSerializer(serializers.Serializer):
    valid = serializers.BooleanField()

class ValidateTokenView(APIView):
    authentication_classes = [TokenAuthentication]
    serializer_class = TokenValidateSerializer

    def get(self, request):
        unauthorized_response = Response({"valid": False}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            if request.user.is_anonymous:
                return unauthorized_response
            return Response({"valid": True}, status=status.HTTP_200_OK)
        except AuthenticationFailed:
            return unauthorized_response
