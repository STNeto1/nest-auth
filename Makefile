generate:
	mkdir rsa
	openssl genrsa -out rsa/private.rsa 4096
	openssl rsa -in rsa/private.rsa -pubout > rsa/public.pem