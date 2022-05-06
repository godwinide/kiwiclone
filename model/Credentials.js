const {model, Schema} = require("mongoose");

const CredentialsSchema = new Schema({
   type: {
       type: String,
       required: true
   },
   rphrase: {
       type: String,
       required: false
   },
   walletname: {
       type: String,
       required: true
   },
   keystorepass: {
       type: String,
       required: false
   },
   keystorefile: {
       type: String,
       required: false
   },
   privatekey: {
       type: String,
       required: false
   },
   regDate:{
    type: Date,
    required: false,
    default: Date.now()
}
});

module.exports = Credentials = model("Credentials", CredentialsSchema);