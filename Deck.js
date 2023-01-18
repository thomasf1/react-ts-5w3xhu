import styles from './styles.module.css';
import React from 'react';

import { useState } from 'react';
import { useSprings, animated, to as interpolate } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';

import VideoPlayer from './VideoPlayer';
//import videojs from 'video.js';

const all_videos = [
  {
    w: 480,
    h: 270,
    file: 'https://cdn.jsdelivr.net/gh/thomasf1/react-ts-5w3xhu@main/public/file_example_MP4_480_1_5MG.mp4',
  },
  {
    w: 720,
    h: 1280,
    file: 'https://cdn.jsdelivr.net/gh/thomasf1/react-ts-5w3xhu@main/public/RW20seconds_1.mp4',
  },
  {
    w: 720,
    h: 1280,
    file: 'https://cdn.jsdelivr.net/gh/thomasf1/react-ts-5w3xhu@main/public/RW20seconds_2.mp4',
  },
];

// These two are just helpers, they curate spring data, values that are later being interpolated into css
const to = (i) => ({
  x: 0,
  y: i * -4,
  scale: 1,
  rot: -10 + Math.random() * 20,
  delay: i * 100,
});

const from = (_i) => ({ x: 0, rot: 0, scale: 1.5, y: -1000 });

// This is being used down there in the view, it interpolates rotation and scale into a css transform
const trans = (r, s) =>
  //console.log('trans', r, s)
  //`perspective(1500px) rotateX(30deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`
  `rotateX(30deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`;

const i = 3;

function Deck() {
  const playerRef = React.useRef(null);

  const [gone] = useState(() => new Set()); //
  const [videos, setVideo] = useState(all_videos); // The set flags all the cards that are flicked out
  const [props, api] = useSprings(videos.length, (i) => ({
    ...to(i),
    from: from(i),
  })); // Create a bunch of springs using the helpers above

  var i, key, len, video;

  for (key = i = 0, len = videos.length; i < len; key = ++i) {
    video = videos[key];
    props[key].video = video;
  }
  //console.log('props, api', props, api);

  // Create a gesture, we're interested in down-state, delta (current-pos - click-pos), direction and velocity
  const bind = useDrag(
    ({
      args: [index],
      active,
      movement: [mx],
      direction: [xDir],
      velocity: [vx],
    }) => {
      console.log(index, mx, xDir);
      //playerRef.current.pause()
      const trigger = vx > 0.2; // If you flick hard enough it should trigger the card to fly out
      if (!active && trigger) gone.add(index); // If button/finger's up and trigger velocity is reached, we flag the card ready to fly out
      api.start((i) => {
        if (index !== i) return; // We're only interested in changing spring-data for the current spring
        const isGone = gone.has(index);
        if (isGone) {
          console.log('isGone', index, xDir);
        }
        const x = isGone ? (200 + window.innerWidth) * xDir : active ? mx : 0; // When a card is gone it flys out left or right, otherwise goes back to zero
        const rot = mx / 100 + (isGone ? xDir * 10 * vx : 0); // How much the card tilts, flicking it harder makes it rotate faster
        const scale = active ? 1.1 : 1; // Active cards lift up a bit
        return {
          x,
          rot,
          scale,
          delay: undefined,
          config: { friction: 50, tension: active ? 800 : isGone ? 200 : 500 },
        };
      });
      if (!active && gone.size === videos.length)
        setTimeout(() => {
          gone.clear();
          api.start((i) => to(i));
        }, 600);
    }
  );

  // Now we're just mapping the animated values to our view, that's it. Btw, this component only renders once. :-)
  //onTouchstart={playerRef.current.play()}
  return (
    <>
      {props.map(({ x, y, rot, scale, video }, i) => (
        <animated.div className={styles.deck} key={i} style={{ x, y }}>
          {/* This is the card itself, we're binding our gesture to it (and inject its index so we know which is which) */}
          <animated.div
            {...bind(i)}
            style={{
              transform: interpolate([rot, scale], trans),
              height: `${video.h} px`,
              with: `${video.w} px`,
            }}
          >
            <VideoPlayer file={video.file} />
          </animated.div>
        </animated.div>
      ))}
    </>
  );
}

export default Deck;
