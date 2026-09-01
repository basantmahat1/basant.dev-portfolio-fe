import { forwardRef } from 'react';

const Button = forwardRef(
  ({ variant = 'primary', as: Component = 'button', className = '', children, ...props }, ref) => {
    const base = variant === 'primary' ? 'btn-primary' : 'btn-secondary';
    return (
      <Component ref={ref} className={`${base} ${className}`} {...props}>
        {children}
      </Component>
    );
  }
);

Button.displayName = 'Button';
export default Button;
