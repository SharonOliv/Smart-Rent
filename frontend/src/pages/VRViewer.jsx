import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import * as PANOLENS from "panolens";

window.process = { env: { NODE_ENV: "production" } };

const VRViewer = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const imageParam = params.get("image");
  const title = params.get("title");

  useEffect(() => {
    const imageSrc = imageParam || "/images/sample-360.jpg";
    const container = document.querySelector("#vr-container");
    const panorama = new PANOLENS.ImagePanorama(imageSrc);
    const viewer = new PANOLENS.Viewer({ container });
    viewer.add(panorama);

    return () => {
      viewer.dispose?.();
    };
  }, [imageParam]);

  return (
    <div className="relative">
      <Link
        to="/rent"
        className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-ink/80 px-3.5 py-2 text-sm font-medium text-paper backdrop-blur hover:bg-ink"
      >
        <ArrowLeft size={15} /> Back to listings
      </Link>
      {title && (
        <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-ink/80 px-4 py-2 font-display text-sm text-paper backdrop-blur">
          {title}
        </div>
      )}
      <div id="vr-container" style={{ width: "100%", height: "100vh" }} />
    </div>
  );
};

export default VRViewer;
