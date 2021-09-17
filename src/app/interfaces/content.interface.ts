interface DataRectangle {
  id: number,
  label: string,
  position: {
    x: number,
    y: number
  },
  size: {
    width: number,
    height: number
  }
}

interface DataLine {
  from: number,
  to: number
}

export {DataRectangle, DataLine}
