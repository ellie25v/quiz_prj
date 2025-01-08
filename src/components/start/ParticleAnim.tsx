// import Particles from "@tsparticles/react";
// import { ISourceOptions } from "@tsparticles/engine";

// const options: ISourceOptions = {
//   particles: {
//     number: {
//       value: 10,
//     },
//     color: {
//       value: "#ffffff",
//     },
//     shape: {
//       type: "circle",
//     },
//     size: {
//       value: 5,
//       animation: {
//         enable: true,
//         speed: 10
//       },
//     },
//     move: {
//       enable: true,
//       speed: 10,
//       direction: "none",
//       random: true,
//       straight: false,
//       outModes: {
//         default: "destroy",
//       },
//     },
//   },
//   interactivity: {
//     events: {
//       onHover: {
//         enable: true,
//         mode: "burst", // Trigger burst animation on hover
//       },
//     },
//     modes: {
//       burst: {
//         particles: 20, // Number of particles in the burst
//         distance: 200, // Distance the particles travel
//       },
//     },
//   },
//   detectRetina: true, // Retina support
// };

// const ParticleAnim = () => {

//   return (<Particles id="myparticles" options={options} />
//   );
// };

// export default ParticleAnim;

import React, { useEffect } from "react";
import Particles from "@tsparticles/react";
import { ISourceOptions } from "@tsparticles/engine";

interface ParticleAnimProps {
  show: boolean;
}

const options: ISourceOptions = {
  particles: {
    number: {
      value: 0,
    },
    color: {
      value: "#fff",
    },
    shape: {
      type: "circle", 
    },
    size: {
      value: { min: 3, max: 7 }, 
      animation: {
        enable: true,
        speed: 10,
      },
    },
    move: {
      enable: true,
      speed: 10,
      direction: "none",
      random: true,
      straight: false,
      outModes: {
        default: "destroy",
      },
    },
  },
  interactivity: {
    events: {
      onHover: {
        enable: false,
      },
    },
  },
  detectRetina: true,
};

const ParticleAnim: React.FC<ParticleAnimProps> = ({ show }) => {
  useEffect(() => {}, [show]);

  if (!show) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 10,
      }}
    >
      <Particles id="particles" options={options} />
    </div>
  );
};

export default ParticleAnim;
