import React from 'react'

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  placeholder?: string
  extraClassName?: string
  disabled?: boolean
  id?: string
  type?: string
}

const TextInput: React.FC<TextInputProps> = ({
  value,
  onChange,
  required = false,
  placeholder = '',
  extraClassName = '',
  disabled = false,
  id,
  type = 'text',
  ...props
}) => {
  return (
    <input
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      disabled={disabled}
      id={id}
      type={type}
      className={`
        w-full px-3 py-2 text-sm rounded-md border transition-colors
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
        ${disabled
          ? "bg-muted text-muted-foreground cursor-not-allowed"
          : "bg-background text-foreground"}
        ${extraClassName}
      `}
      {...props}
    />
  )
}

export default TextInput

