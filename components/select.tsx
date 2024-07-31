"use client"

import { useMemo } from 'react';
import { SingleValue, components } from 'react-select';
import CreatableSelect from 'react-select/creatable';

type Props = {
  onChange: (value?: string) => void;
  onCreate?: (value: string) => void;
  options?: { label: string; value: string, icon?: string }[];
  value?: string | null | undefined;
  disabled?: boolean;
  placeholder?: string;
}

const { Option } = components;
const OptionComponent = (props: any) => (
  <Option {...props} className='flex items-center gap-2 pl-3'>
    {props.data.icon && (
      <span className='text-lg pr-2' role='img'>
        {props.data.icon}
      </span>
    )}
    <span>{props.data.label}</span>
  </Option>
)

export const Select = ({
  value,
  onChange,
  onCreate,
  options = [],
  disabled,
  placeholder
}: Props) => {
  const onSelect = (option: SingleValue<{ label: string, value: string }>) => {
    onChange(option?.value);
  };

  const formattedValue = useMemo(() => {
    return options.find((option) => option.value === value);
  }, [options, value])

  return (
    <CreatableSelect
      placeholder={placeholder}
      className='text-sm h-10'
      styles={{
        control: (base) => ({
          ...base,
          borderColor: '#e2e8f0',
          ":hover": {
            borderColor: '#e2e8f0'
          }
         })
      }}
      value={formattedValue}
      onChange={onSelect}
      options={options}
      onCreateOption={onCreate}
      isDisabled={disabled}
      components={{ Option: OptionComponent }}
    />
  )
}