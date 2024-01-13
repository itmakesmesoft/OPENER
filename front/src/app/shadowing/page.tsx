import CatComponent from './components/CatComponent';
import ViewList from './components/ViewList';

const page = ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) => {
  const category = searchParams?.category;

  return (
    <div className="inner-content">
      <h1 className="text-2xl font-extrabold my-2">영어 쉐도잉</h1>
      <p className="text-sm mb-4">영어는 씹어야 제 맛이지</p>
      <CatComponent category={category} />
      <ViewList category={category} />
    </div>
  );
};

export default page;
