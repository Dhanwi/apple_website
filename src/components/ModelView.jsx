import {
  Html,
  OrbitControls,
  PerspectiveCamera,
  View,
} from "@react-three/drei";

import * as THREE from "three";
import Lights from "./Lights";
import { Suspense } from "react";
import IPhone from "./IPhone";
import Loader from "./Loader";

const ModelView = ({
  index,
  groupRef,
  gsapType,
  controlRef,
  setRotationState,
  size,
  item,
}) => {
  return (
    <View
      index={index}
      id={gsapType}
      // earlier the className code was this :className={`w-full h-full ${index === 2} ? 'right-[-100%] : ''`}

      // due to which the models were showing, up and down, after adding absolute position, it shows on one on the another, after that making correction in the dynamic position code, that is ${..... this line, }, we get it correct
      // so correct code is: className={`w-full h-full absolute ${index === 2 ? 'right-[-100%]' : ''}`}

      className={`w-full h-full absolute ${index === 2 ? "right-[-100%]" : ""}`}
    >
      {/* Ambient Light */}
      <ambientLight intensity={0.3} />
      {/* in .eslintrc.cjs file, in plugin -> added  @react-three, it is because, earlier intensity={0.3 was showing error but after adding this it is not complaining}
       */}

      <PerspectiveCamera makeDefault position={[0, 0, 4]} />

      <Lights />
      {/* OrbitControl is property of Three.js, and all those below props are the properties in OrbitControl */}
      <OrbitControls
        makeDefault
        ref={controlRef}
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.4}
        target={new THREE.Vector3(0, 0, 0)}
        onEnd={() => setRotationState(controlRef.current.getAzimuthalAngel())}
      />

      <group
        ref={groupRef}
        name={`${index === 1} ? 'small' : 'large`}
        position={[0, 0, 0]}
      >
        <Suspense fallback={<Loader />}>
          <IPhone
            scale={index === 1 ? [15, 15, 15] : [17, 17, 17]}
            item={item}
            size={size}
          />
        </Suspense>
      </group>
    </View>
  );
};

export default ModelView;
