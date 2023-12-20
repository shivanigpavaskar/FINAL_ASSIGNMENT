import { Button, Container, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import{ basicSchema }from "../Components/ValidationSchema";
import { Formik, FormikHelpers} from "formik";
import { Link, Navigate, useNavigate } from "react-router-dom";
 import axios from "axios";


interface FormData {
  email: string;
  password: string;
  designation: string;
}

const newData: FormData = {
  email: "",
  password: "",
  designation: "",
};
 

function Login() {
  const navigate= useNavigate()

  const onSubmit = async (
    values: FormData,
    actions: FormikHelpers<FormData>
  ) => {
    console.log(values);
    // console.log(actions.isValid);
    actions.setSubmitting(false);
    setTimeout(() => {
      actions.setSubmitting(false);
      // setdisplayData((prevData)=>[...prevData,values]);
    }, 1000);



    try {
      const result = await axios.get('http://localhost:3000/users');
      Navigate
  
      result.data.forEach((user:FormData) => {
        if (user.email === values.email) {
          if (user.password === values.password) {
            if (user.designation === values.designation) {
              localStorage.setItem('UserLoggedIn',JSON.stringify(user))
              alert("Login Successful!");
              navigate('/Dashboard')
            } else {
              actions.setErrors({
                designation: "wrong designation"
              });
              actions.setSubmitting(false);
              return;
            }
          } else if (values.email !== "") {
            actions.setErrors({
              email: "wrong email"
            });
            actions.setSubmitting(false);
            return;
          } else if (values.designation !== "") {
            actions.setErrors({
              designation: "wrong designation"
            });
            actions.setSubmitting(false);
            return;
          }
        }
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

















     
//          await axios.get('http://localhost:3000/users')
//            .then(result=>{
//             result.data.map(user =>{
//               if (user.email === values.email){
// if(user.password === values.password){
//   if(user.designation === values.designation){
//     alert("LOGIN SUCCESSFUL")
//   }else actions.setErrors({
//     email: "wrong email"
//   });
//   actions.setSubmitting(false);
//   return;
  
//    }
// }else  actions.setErrors({
//   password: "wrong password"
// });
// actions.setSubmitting(false);
// return;


// else if actions.setErrors({
//   designation: "wrong designation"
// });
// actions.setSubmitting(false);
// return;
          

//            }
//       } catch (error) {
//          console.error('Error:', error);
//       }
//     }
//   };

 
  return (
    <>
      <h1>Log In</h1>
      <div>
        <Formik
          initialValues={newData}
          validationSchema={basicSchema}
          onSubmit={onSubmit}
        >
          {({
            values,
            errors,
            touched,
            isSubmitting,
            handleBlur,
            handleChange,
            handleSubmit,
            // isValid,
          }) => (
            <Container>
              <Form onSubmit={handleSubmit} autoComplete="off">
                <div>
                  <Form.Label htmlFor="email">Enter Your Email: </Form.Label>
                  <Form.Control
                  name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                      errors.email && touched.email ? "Form.Control-error" : ""
                    }
                  />
                  {touched?.email && errors?.email && (
                    <p className="error">{errors.email}</p>
                  )}

                  <br />
                </div>

                <div>
                  <Form.Label htmlFor="password">Enter your Password:</Form.Label>
                  <Form.Control
                  name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                      errors.password && touched.password
                        ? "Form.Control-error"
                        : ""
                    }
                  />

                  {touched?.password && errors?.password && (
                    <p className="error">{errors.password}</p>
                  )}
                  <br />
                  
                </div>

                <div>
                  <Form.Label htmlFor="designation">
                    Select your designation:
                  </Form.Label>
                  <Form.Control
                    name="designation"
                    as="select"
                    value={values.designation}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                      errors.designation && touched.designation
                        ? "Form.Control-error"
                        : ""
                    }
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    <option value="Trainer">Trainer</option>
                    <option value="Student">Student</option>
                  </Form.Control>

                  {touched?.designation && errors?.designation && (
                    <p className="error">{errors.designation}</p>
                  )}
                  <br />
                
                </div>

                <div>
                  <Button type="submit" disabled={ isSubmitting}>
                    Login
                  </Button>
                  <br />
                </div>
              </Form>
              <div>
                <p>New here? <Link to="/Signup">Signup Now</Link>  </p>
              </div>
      
            </Container>
          )}
        </Formik>
      </div>
    </>
  );
}

export default Login;

 