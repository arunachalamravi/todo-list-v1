import React from "react";

export default function InputField(props) {
  const { type, title, placeholder, className, onChange = () => {},...rest } = props;
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={className}
      value={title}
      onChange={onChange}
      {...rest}
    />
  );
}
