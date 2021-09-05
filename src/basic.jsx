import React from "react";
import ReactDOM from "react-dom";
import { Formik, Field, Form, FastField } from "formik";
import * as Yup from "yup";

export const Basic = () => (
  <div>
    <h1>Random Password Generator</h1>
    <Formik
      initialValues={{
        isMultiple: false,
        length: 10,
        options: { numbers: true, uppercase: true },
      }}
      onSubmit={async (values) => {
        alert(JSON.stringify(values));
      }}
    >
      {({ values }) => (
        <Form>
          <div role="group" aria-labelledby="checkbox-group">
            <label>
              <span>Password Length: </span>
              <Field name="length" type="number" max="100" />
            </label>
            <br />
            <label>
              Include Numbers*:
              <Field name="options.numbers" type="checkbox" /> ( e.g. 123456 )
            </label>
            <br />
            <label>
              Include Symbols*:
              <Field name="options.symbols" type="checkbox" /> ( e.g. @#$% )
            </label>
            <br />
            <label>
              Include Lowercase Characters*:
              <Field name="options.lowercase" type="checkbox" /> ( e.g. abcdefgh
              )
            </label>
            <br />
            <label>
              Include Uppercase Characters*:
              <Field name="options.uppercase" type="checkbox" /> ( e.g. ABCDEFGH
              )
            </label>
            <br />
            <label>
              Exclude Similar Characters:
              <Field
                name="options.excludeSimilarCharacters"
                type="checkbox"
              />{" "}
              ( e.g. i, l, 1, L, o, 0, O )
            </label>
            <br />
            <label>
              Include at least one character from each pool:
              <Field name="options.strict" type="checkbox" />
            </label>
            <br />
            <label>
              <span>Exclude some Characters: </span>
              <FastField name="options.exclude" />
            </label>
            <br />
          </div>
          <br />
          <br />
          <label>
            Bulk generate multiple passwords at once**:
            <Field name="isMultiple" type="checkbox" />
            <Field
              disabled={values.isMultiple ? false : true}
              name="amount"
              type="number"
              max="100"
            />
          </label>
          <p>
            *At least one should be true.
            <br />
            **With the same options for all. Returns an array.
          </p>

          <button type="submit">
            {values.isMultiple ? "Generate Passwords" : "Generate Password"}
          </button>
        </Form>
      )}
    </Formik>
  </div>
);

ReactDOM.render(<Basic />, document.getElementById("root"));
