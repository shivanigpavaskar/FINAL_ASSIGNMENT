import * as Yup from "yup";

const passwordValidations = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/;
const emailValidations = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;



export const basicSchema = Yup.object({
     
    email: Yup.string()
      .trim()
      .required("Email address is required")
      .matches(emailValidations, "Please enter a valid email"),
  
    password:Yup.string()
      .min(8)
      .matches(passwordValidations, { message: "password should be strong" })
      .required("Password is required"),


      designation: Yup.string()
      .required("Designation is required"),
  
  });
  

  export const basicSchema2 =Yup.object({
    firstName: Yup.string().required("Please enter your username!"),
  
    lastName: Yup.string().required("Please enter your lastname!"),
  
    email: Yup.string()
      .trim()
      .required("Email address is required")
      .matches(emailValidations, "Please enter a valid email"),
  
    password:Yup.string()
      .min(8)
      .matches(passwordValidations, { message: "Password should be strong" })
      .required("Password is required"),


      designation: Yup.string()
      .required("Designation is required"),

  
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), ""], "Password must match")
      .required("please confirm your password"),
  
  });
  

 