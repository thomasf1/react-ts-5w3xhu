import React from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const videoJsOptions = {
  autoplay: true,
  controls: true,
  responsive: false,
  fluid: true,
  fullscreen: false,
  liveui: false,
  loop: true,
  playsinline: true,
  preload: 'auto',
  sources: [],
};

/*
{
			src: '1461833570058600453.mp4',
			type: 'video/mp4'
		}
*/

export const VideoPlayer = (props) => {
  console.log('VideoPlayer props', props);
  const videoRef = React.useRef(null);
  const playerRef = React.useRef(null);
  //const {options, onReady, sources} = props;

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on('waiting', () => {
      videojs.log('player is waiting');
    });

    player.on('ready', () => {
      setTimeout(() => {
        player.setAttribute('muted', true);
        //player.play();
      }, 2000);
      videojs.log('player is ready');
    });

    player.on('dispose', () => {
      videojs.log('player will dispose');
    });
  };

  const options = props.options || {...videoJsOptions};
  const onReady = props.onReady || handlePlayerReady;

  if (props.file) {
    console.log('props.file', props.file);
    options.sources = [
      {
        src: props.file,
        type: 'video/mp4',
      },
    ];
  }
  console.log(props.id);
  if (props.autoplay) {
    options.autoplay = false;
  } else {
    options.autoplay = false;
  }

  React.useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
      const videoElement = document.createElement('video-js');

      videoElement.classList.add('vjs-big-play-centered');
      videoRef.current.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, options, () => {
        videojs.log('player is ready');
        onReady && onReady(player);
      }));

      // You could update an existing player in the `else` block here
      // on prop change, for example:
    } else {
      const player = playerRef.current;
      player.autoplay(options.autoplay);
      player.src(options.sources);
    }
  }, [options, videoRef]);

  // Dispose the Video.js player when the functional component unmounts
  React.useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  );
};

export default VideoPlayer;
