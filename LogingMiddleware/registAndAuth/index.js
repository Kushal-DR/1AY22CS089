const axios = require("axios");

//post data
const registrationData = {
  email: "kushal.d.rr.22.becs@acharya.ac.in",
  name: "Kushal D R",
  mobileNo: "7892298215",
  githubUsername: "Kushal-DR",
  rollNo: "1AY22CS089",
  accessCode: "xtBSqM"
};

//some datas required for Auth
const PartialAuthData = {
  email: "kushal.d.rr.22.becs@acharya.ac.in",
  name: "Kushal D R",
  rollNo: "1AY22CS089",
  accessCode: "xtBSqM"
}

async function registerAndAuthenticateWithTestWindow() {
  try {
    const registerResponse = await axios.post(
      "http://20.244.56.144/evaluation-service/register",
      registrationData
    );

    const { clientID, clientSecret } = registerResponse.data;



    
    console.log("client Id is : " , clientID);
    console.log("client secret is : " ,clientSecret)

    AthenticationFn(clientID, clientSecret)
    

  } catch (error) {
    console.error( error.message);
  }
}

const AthenticationFn = async (clientId , clientSecret) => {
  try{
    const authData = {
      ...PartialAuthData,
      clientId ,
      clientSecret                          
    };

    const authResponse = await axios.post(
      "http://20.244.56.144/evaluation-service/auth",
      authData
    );

     const { access_token } = authResponse.data;
     console.log("Access Token is :", access_token);
 
}
catch(error){
    console.error(error);

}


}

registerAndAuthenticateWithTestWindow();


/* clientId : 297882d9-0f11-4cf7-92e4-914be9d37a9c
clientSecret : sZuECGcTbSDAPZdz

optional if u want Authentication code again after generating secret keys 

AthenticationFn("297882d9-0f11-4cf7-92e4-914be9d37a9c" , "sZuECGcTbSDAPZdz" )*/
