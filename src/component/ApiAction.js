import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

const SignupSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "Too Short!")
    .max(70, "Too Long!")
    .required("*First Name is Required"),
  lastName: Yup.string()
    .min(4, "Too Short!")
    .max(70, "Too Long!")
    .required("*Last Name is Required"),
  mobileNo: Yup.string()
    .min(10, "Too Short!")
    .max(10, "Too Long!")
    .required("*Contact No. is Required"),
  email: Yup.string().email("*Invalid email").required("*Email is Required"),
  nickName: Yup.string()
    .min(4, "Too Short!")
    .max(70, "Too Long!")
    .required("*Nick Name is Required"),
});

function ApiAction() {
  const [data, setData] = useState([]);
  const [initialValues, setInitialValues] = useState({
    firstName: "",
    lastName: "",
    mobileNo: "",
    email: "",
    nickName: "",
  });

  const token = {
    headers: {
      Authorization:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE3MTM2MTA2NzQ4NDctMTUxNTQzOTIzIiwiaWF0IjoxNzEzNjEwNjc0LCJleHAiOjE3MTM3ODM0NzR9.12mBaVW6YnmFkiarJzqAwNApYReIRQ7MuNQdyLuVBhI",
    },
  };

  const getData = () => {
    axios
      .get("https://service.apikeeda.com/contact-book", token)
      .then(function (response) {
        setData(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleDelete = (id) => {
    axios
      .delete(`https://service.apikeeda.com/contact-book/${id}`, token)
      .then(function (response) {
        getData();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  const resetFormValues = () => {
    setInitialValues({
      firstName: "",
      lastName: "",
      mobileNo: "",
      email: "",
      nickName: "",
    });
  };

  return (
    <>
      <div className="formcontrol">
        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={SignupSchema}
          onSubmit={(values, { resetForm }) => {
            if (values._id) {
              axios
                .patch(
                  `https://service.apikeeda.com/contact-book/${values._id}`,
                  values,
                  token
                )
                .then(function (response) {
                  getData();
                  resetFormValues();
                })
                .catch(function (error) {
                  console.log(error);
                });
            } else {
              axios
                .post(
                  "https://service.apikeeda.com/contact-book",
                  values,
                  token
                )
                .then(function (response) {
                  getData();
                  resetFormValues();
                })
                .catch(function (error) {
                  console.log(error);
                });
            }
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <h1>AXIOS + FORMIK</h1>
              <Field name="firstName" placeholder="enter Fname here.." />
              <ErrorMessage name="firstName" component={"p"} />

              <Field
                name="lastName"
                type="text"
                placeholder="enter Lname here.."
              />
              <ErrorMessage name="lastName" component={"p"} />

              <Field
                name="mobileNo"
                type="text"
                placeholder="enter Mobile Number here.."
              />
              <ErrorMessage name="mobileNo" component={"p"} />

              <Field
                name="email"
                type="email"
                placeholder="enter Email here.."
              />
              <ErrorMessage name="email" component={"p"} />

              <Field
                name="nickName"
                type="text"
                placeholder="enter Nick name here.."
              />
              <ErrorMessage name="nickName" component={"p"} />

              <button type="submit">  {initialValues._id ? "Save Changes" : "Submit"}</button>
            </Form>
          )}
        </Formik>
      </div>
      <table>
        <thead>
          <tr>
            <th>Fname</th>
            <th>Lname</th>
            <th>email</th>
            <th>Mobile</th>
            <th>Nickname</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td>{item.firstName}</td>
              <td>{item.lastName}</td>
              <td>{item.email}</td>
              <td>{item.mobileNo}</td>
              <td>{item.nickName}</td>
              <td>
                <button onClick={() => setInitialValues(item)}>Update</button>
                &nbsp;
                <button onClick={() => handleDelete(item._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default ApiAction;
