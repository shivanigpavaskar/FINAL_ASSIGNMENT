import { Button, Container, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { basicSchema2 } from "../Components/ValidationSchema";
import { Formik, FormikHelpers, yupToFormErrors } from "formik";
import { Link,useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../layouts/Layout";
import './signup.css'
 
interface FormData {
  firstName: string;
  lastName: string;
  designation: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const newData: FormData = {
  firstName: "",
  lastName: "",
  designation: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function Signup() {
  const navigate = useNavigate();
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

    if (Object.keys(yupToFormErrors).length === 0) {
      try {
         await axios.post('http://localhost:3000/users',values);
         alert("You are registered successfully!")
         navigate('/Login')
      } catch (error) {
         console.error('Ops Error:', error);
      }
    }
  };

  return (

    <>
    <Layout>
      <h3>Sign Up</h3>
      <div>
        <Formik
          initialValues={newData}
          validationSchema={basicSchema2}
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
            <Container className="form">
              <Form onSubmit={handleSubmit} autoComplete="off">
                <div>
                  <Form.Label htmlFor="fname">Enter Your FirstName:</Form.Label>
                  <Form.Control
                    name="firstName"
                    type="text"
                    placeholder="Enter your firstName"
                    value={values.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                      errors.firstName && touched.firstName
                        ? "Form.Control-error"
                        : ""
                    }
                  />
                  {touched?.firstName && errors?.firstName && (
                    <p className="error">{errors.firstName}</p>
                  )}
                  <br />
                </div>

                <div>
                  <Form.Label htmlFor="fname">Enter Your LastName: </Form.Label>
                  <Form.Control
                    name="lastName"
                    type="text"
                    placeholder="Enter your lastName"
                    value={values.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                      errors.lastName && touched.lastName
                        ? "Form.Control-error"
                        : ""
                    }
                  />
                  {touched?.lastName && errors?.lastName && (
                    <p className="error">{errors.lastName}</p>
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
                  <Form.Label htmlFor="password">
                    Enter your Password:
                  </Form.Label>
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
                  <Form.Label htmlFor="confirmPassword">
                    Enter your Password:
                  </Form.Label>
                  <Form.Control
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                      errors.confirmPassword && touched.confirmPassword
                        ? "Form.Control-error"
                        : ""
                    }
                  />

                  {touched?.confirmPassword && errors?.confirmPassword && (
                    <p className="error">{errors.confirmPassword}</p>
                  )}
                  <br />
                </div>

                <div>
                  <Button type="submit" disabled={isSubmitting}   className="Button">
                    Sign Up
                  </Button>
                  <br />
                </div>
              </Form>
              <div>
                <p>
                  Already have an account? <Link to="/Login">Login here</Link>{" "}
                </p>
              </div>
            </Container>
          )}
        </Formik>
      </div>
      </Layout>
    </>
    
  );
}

export default Signup;
