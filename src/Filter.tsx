import React, { useRef, useCallback } from 'react';
import './Filter.css';

type Props = {
  name: string;
  license: string;
  onSubmit: (name: string, license: string) => void;
};

const Filter: React.FC<Props> = ({ name, license, onSubmit }: Props) => {
  const nameRef = useRef<HTMLInputElement>(null);
  const licenseRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      const name = nameRef.current?.value || '';
      const license = licenseRef.current?.value || '';

      onSubmit(name, license);
    },
    [onSubmit],
  );

  return (
    <form onSubmit={handleSubmit} className="Filter">
      <label>
        Name: <input name="name" defaultValue={name} ref={nameRef} />
      </label>
      <label>
        License: <input name="license" defaultValue={license} ref={licenseRef} />
      </label>
      <button type="submit">Search</button>
    </form>
  );
};

export default Filter;
