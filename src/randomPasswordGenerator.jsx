import React, { useState } from "react";
import { Formik, Field, Form, FastField } from "formik";

// import * as Yup from "yup";

const generate = async (options) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ options }),
  };
  const response = await fetch(
    "https://wkswk8mwr1.execute-api.us-east-1.amazonaws.com/dev/generate/",
    requestOptions
  );
  return await response.json();
};

const generateMultiple = async (values) => {
  try {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    };
    const response = await fetch(
      "https://wkswk8mwr1.execute-api.us-east-1.amazonaws.com/dev/generateMultiple/",
      requestOptions
    );
    return await response.json();
  } catch (error) {
    alert(JSON.stringify(error));
  }
};

export function RandomPasswordGenerator() {
  const [password, setPassword] = useState();
  const [ButtonCopyText, setButtonCopyText] = useState("Copy");
  const [ButtonGenerateText, setButtonGenerateText] =
    useState("Generate Password");

  function changeText() {
    setButtonCopyText("Copied");
    setTimeout(() => setButtonCopyText("Copy"), [1000]);
  }

  return (
    <div>
      <h1>Random Password Generator</h1>
      <Formik
        initialValues={{
          isMultiple: false,
          amount: 1,
          options: {
            length: 10,
            uppercase: true,
            lowercase: true,
            exclude: "",
          },
        }}
        onSubmit={async (values) => {
          setButtonGenerateText("Generating Password...");
          if (!values.isMultiple) {
            setButtonGenerateText("Generating Password...");
            const updatedValues = values;
            delete updatedValues["isMultiple"];
            const { options } = updatedValues;
            const result = await generate(options);
            setPassword(result);
            setButtonGenerateText("Generate Password");
          } else {
            setButtonGenerateText("Generating Passwords...");
            const updatedValues = values;
            delete updatedValues["isMultiple"];
            const result = await generateMultiple(updatedValues);
            const updatedResult = JSON.stringify(result)
              .replaceAll("[", "")
              .replaceAll("]", "")
              .replaceAll('"', "")
              .replaceAll(",", " ");
            setPassword(updatedResult);
            values.isMultiple = true;
            setButtonGenerateText("Generate Password");
          }
        }}
      >
        {({ values }) => (
          <Form>
            <div role="group" aria-labelledby="checkbox-group">
              <label>
                <span>Password Length: </span>
                <Field name="options.length" type="number" max="100" />
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
                <Field name="options.lowercase" type="checkbox" /> ( e.g.
                abcdefgh )
              </label>
              <br />
              <label>
                Include Uppercase Characters*:
                <Field name="options.uppercase" type="checkbox" /> ( e.g.
                ABCDEFGH )
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

            <button type="submit">{ButtonGenerateText}</button>
          </Form>
        )}
      </Formik>
      <br />
      {password && (
        <div>
          <textarea rows="4" cols="50" disabled value={password} />
          <br />{" "}
          <button
            onClick={() => {
              navigator.clipboard.writeText(password);
              changeText();
            }}
          >
            {ButtonCopyText}
          </button>
        </div>
      )}
    </div>
  );
}

export default RandomPasswordGenerator;
