'use client';
import useCategory from './components/useCategory';
import ViewList from './components/ViewList';

const page = () => {
  const { CatComponent, category } = useCategory();
  return (
    <div className="inner-content">
      <h1 className="text-2xl font-extrabold my-2">영어 쉐도잉</h1>
      <p className="text-sm mb-4">영어는 씹어야 제 맛이지</p>
      <CatComponent />
      <ViewList category={category} />
    </div>
  );
};

export default page;
