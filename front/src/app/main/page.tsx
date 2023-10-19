// import Famous from '@/app/main/components/Famous';
import Recommended from './components/Recommend';
import Roadmap from '@/app/main/components/Roadmap';
// import Main from '@/app/three/intro/page';
// import Rank from './components/Rank';
// import dynamic from 'next/dynamic';
// import Image from 'next/image';
import Carousel from './components/Carousel';

const Home = () => {
  return (
    <div>
      <Carousel />
      <div className="relative w-full h-full min-w-[330px] max-w-[1024px] p-4">
        <Roadmap />
        {/* <Famous /> */}
        <Recommended />
        {/* <Rank /> */}
      </div>
    </div>
  );
};

export default Home;
