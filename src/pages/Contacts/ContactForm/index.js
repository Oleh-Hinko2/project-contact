import React from "react";

import { Formik, Field, Form } from "formik";

import {
  addNewContact,
  toggleShowContactModal,
  editContact,
} from "../../../redux/contacts";
import { connect } from "react-redux";

function validateEmail(value) {
  let error;
  if (!value) {
    error = "Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    error = "Invalid email address";
  }
  return error;
}

function validateName(value) {
  let error;
  if (value.length <= 2) {
    error = "Minimum length must be more than two characters";
  }
  return error;
}

function validatePhone(value) {
  let error;
  const pattern = new RegExp(/^[0-9\b]+$/);
  if (!pattern.test(value)) {
    error = "Please enter only number.";
  } else if(value.length != 10){
    error = "Please enter valid phone number.";
  }
  return error;
}


const AddContactForm = ({ initialValues, addNewContact, editContact }) => {
  const handleSubmit = (values) => {
    initialValues.id
      ? editContact({ contactId: initialValues.id, data: values })
      : addNewContact({ id: Math.random(), ...values });
  };
  return (
    <div className="add-new-contact-form">
    <Formik
      initialValues={initialValues}
      onSubmit={async (values) => handleSubmit(values)}
    >
      {({ errors, touched }) => (
        <Form>
          <div className="add-new-contact-form__field">
            <label htmlFor="name">Name</label>
            <Field
              id="name"
              name="name"
              validate={validateName}
              placeholder="Please enter name"
            />
            {errors.name && touched.name && (
              <div className="add-new-contact-form__error">{errors.name}</div>
            )}
          </div>
          <div className="add-new-contact-form__field">
            <label htmlFor="phone">Phone</label>
            <Field
              id="phone"
              name="phone"
              type="phone"
              placeholder="Please enter phone"
              validation={validatePhone}
            />
            {errors.phone && touched.phone && (
              <div className="add-new-contact-form__error">{errors.phone}</div>
            )}
          </div>
          <div className="add-new-contact-form__field">
            <label htmlFor="email">Email</label>
            <Field
              id="email"
              validate={validateEmail}
              name="email"
              placeholder="Please enter email"
              type="email"
            />
            {errors.email && touched.email && (
              <div className="add-new-contact-form__error">{errors.email}</div>
            )}
          </div>
          <div className="add-new-contact-form__actions">
            <button type="submit">Submit</button>
          </div>
        </Form>
      )}
    </Formik>
  </div>
  )
};

const mapSateToProps = (state) => ({
  initialValues: state.contacts.initialValues,
});

const mapDispatchToProps = {
  addNewContact,
  toggleShowContactModal,
  editContact,
};

export default connect(mapSateToProps, mapDispatchToProps)(AddContactForm);
