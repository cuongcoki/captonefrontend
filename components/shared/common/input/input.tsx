import React from "react";
import "./input.css";

interface InputAnimationProps {
  nameFor: string;
  className?: string;
  type?: string;
  [key: string]: any;
}

const InputAnimation = React.forwardRef<HTMLInputElement, InputAnimationProps>(
  ({ nameFor, className, type = "text", ...props }, ref) => {
    // const [value, setValue] = React.useState("");
    return (
      <div className={`inputBox ${className}`}>
        <input
          type={type}
          {...props}
          ref={ref}
          placeholder=""
          // value={value}
          // onChange={(currentValue) => {
          //   setValue(currentValue.target.value);
          //   console.log(currentValue.target.value);
          // }}
        />
        <span>{nameFor}</span>
      </div>
    );
  }
);

InputAnimation.displayName = "InputAnimation";

export default InputAnimation;
