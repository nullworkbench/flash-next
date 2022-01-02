const OtherIcon = (props: React.SVGProps<SVGSVGElement>): JSX.Element => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 163.94 163.94"
      style={{ fill: "#231815" }}
      {...props}
    >
      <path
        d="M100,182a82,82,0,1,1,82-82A82.06,82.06,0,0,1,100,182Zm0-152.6A70.63,70.63,0,1,0,170.63,100,70.7,70.7,0,0,0,100,29.37Z"
        transform="translate(-18.03 -18.03)"
      />
      <circle cx="48.32" cy="81.97" r="12.8" />
      <circle cx="81.97" cy="81.97" r="12.8" />
      <circle cx="115.61" cy="81.97" r="12.8" />
    </svg>
  );
};
export default OtherIcon;
