import useLocation from "@/hooks/useLocation";
import { MODELS } from "@/utils/constants/paths";

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const [_, setLocation] = useLocation();

  useEffect(() => {
    setLocation(MODELS);
  }, []);

  return null;
};

export default Home;
