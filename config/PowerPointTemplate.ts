export const Config = {
  metadata: {
    author: 'Personal',
    company: 'Personal Company',
    revision: 15,
    subject: 'Slideshow Instagram',
    title: '',
  },
  defineLayout: {
    name: 'INSTAGRAM',
    width: 11.25,
    height: 11.25,
  },
  others: {
    rtlMode: false,
    layout: 'INSTAGRAM',
  },
  defineSlideMaster: {
    title: 'MASTER_SLIDE',
    margin: [0.25, 0.25, 0.25, 0.25],
    background: {
      path: 'temp/texture.jpg',
      transparency: 20,
    },
    objects: [
      {
        image: {
          path: 'temp/background.jpg',
          w: '100%',
          h: '100%',
        },
      },
    ],
    slideNumber: {
      fontSize: 23.6,
      align: 'right',
      color: 'ffffff',
      w: '100%',
      h: 0.52,
      y: 10.54,
    },
  },
}
