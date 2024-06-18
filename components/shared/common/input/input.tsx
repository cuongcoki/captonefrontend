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
        <input type={type} ref={ref} placeholder="" {...props} />
        <span>{nameFor}</span>
      </div>
    );
  }
);

InputAnimation.displayName = "InputAnimation";

export default InputAnimation;
