[클라이언트: 암호화]
<!-- CryptoJS v3.1.2 -->
<script src="libs/CryptoJSv3.1.2/rollups/aes.js"></script>
<script src="libs/CryptoJSv3.1.2/components/aes.js"></script>
<script src="libs/CryptoJSv3.1.2/rollups/sha256.js"></script>
<script src="libs/CryptoJSv3.1.2/components/sha256.js"></script>
<script>
    CryptoJS.AES.encrypt('암호화하고자 하는 string', 'salt key').toString()
</script>

[서버: 복호화]
const CryptoJS = require("crypto-js");
const bytes = CryptoJS.AES.decrypt(postBody.user_pw, salt[0]['PROJ_ID']);
const decryptedPW = bytes.toString(CryptoJS.enc.Utf8);