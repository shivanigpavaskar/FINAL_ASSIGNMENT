import { Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { basicSchema } from "../../Components/ValidationSchema";
import { Formik, FormikHelpers } from "formik";
import { Link,useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.css";
import Layout from "../../layouts/Layout";
import { useAuth } from "../../service/AuthContext";

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
  const navigate = useNavigate();
  const {login} =useAuth();

  const onSubmit = async (
    values: FormData,
    actions: FormikHelpers<FormData>
  ) => {
    console.log(values);
     actions.setSubmitting(false);
      

      try {
        const result = await axios.get("http://localhost:3000/users");
        const user = result.data.find(
          (u: FormData) =>
            u.email === values.email &&
            u.password === values.password &&
            u.designation === values.designation
        );
  
        if (user) {
          localStorage.setItem("UserLoggedIn", JSON.stringify(user));
          alert("Login Successful!");
          login({ loggedIn: true, designation: user.designation, email:user.email}); 
           navigate("/Dashboard");
        } else {
          actions.setErrors({
            designation: "Wrong designation, email, or password",
          });
          actions.setSubmitting(false);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
  
  return (
    <Layout>
      <>
        <h1>Log In</h1>
        <div className="Container">
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
              <div>
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
                        errors.email && touched.email
                          ? "Form.Control-error"
                          : ""
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
                    <Button
                      className="Button"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      Login
                    </Button>
                    <br />
                  </div>
                </Form>
                <div>
                  <p>
                    New here?{" "}
                    <Link to="/Signup" className="Link">
                      Signup Now
                    </Link>{" "}
                  </p>
                </div>
              </div>
            )}
          </Formik>
        </div>
      </>
    </Layout>
  );
}

export default Login;
