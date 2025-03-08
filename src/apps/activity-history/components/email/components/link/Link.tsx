const Link = ({ value }: { value: string }): JSX.Element => {
  return (
    <>
      {value ? (
        <>
          and clicked on{' '}
          <a href={value} target="_blank" rel="noopener">
            {value}
          </a>{' '}
          link
        </>
      ) : null}
    </>
  );
};

export default Link;
