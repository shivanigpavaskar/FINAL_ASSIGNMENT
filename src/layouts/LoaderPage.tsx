import { Suspense } from "react";

const LoaderPage = (Component: any) => (props: any) =>
  (
    <Suspense fallback={<></>}>
      <Component {...props} />
    </Suspense>
  );

export default LoaderPage;
