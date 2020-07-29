const fs = require('fs')
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY

fs.writeFileSync('./google-serviceaccount.json', JSON.stringify({
  "type": "service_account",
  "project_id": "jcloud-inc",
  "private_key_id": "6920b98e9666d2195fcbd45aa0895af89c670166",
  "private_key": PRIVATE_KEY,
  "client_email": "sheetsdb@jcloud-inc.iam.gserviceaccount.com",
  "client_id": "103088840444956346949",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/sheetsdb%40jcloud-inc.iam.gserviceaccount.com"
}))
