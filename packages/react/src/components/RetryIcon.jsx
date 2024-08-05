import PropTypes from 'prop-types'

export default function RetryIcon({ size = 20 }) {
  return (
    <svg
      t="1720146434956"
      className="tiny-icon"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="60822"
      width={size}
      height={size}
    >
      <path
        d="M512 85.333333c-68.266667 0-132.266667 14.933333-192 44.8-14.933333 8.533333-21.333333 27.733333-14.933333 42.666667 8.533333 14.933333 27.733333 21.333333 42.666666 14.933333C398.933333 162.133333 454.4 149.333333 512 149.333333c200.533333 0 364.8 164.266667 364.8 364.8 0 44.8-8.533333 89.6-23.466667 132.266667l-27.733333-117.333333c-4.266667-17.066667-21.333333-27.733333-38.4-23.466667-17.066667 4.266667-27.733333 21.333333-23.466667 38.4l49.066667 198.4c2.133333 12.8 12.8 21.333333 25.6 23.466667h6.4c10.666667 0 21.333333-4.266667 25.6-14.933334C917.333333 680.533333 942.933333 597.333333 942.933333 512 940.8 277.333333 748.8 85.333333 512 85.333333zM674.133333 838.4c-51.2 25.6-104.533333 38.4-162.133333 38.4-200.533333 0-364.8-164.266667-364.8-364.8 0-49.066667 10.666667-96 27.733333-140.8l40.533334 125.866667c6.4 17.066667 23.466667 25.6 40.533333 21.333333 17.066667-6.4 25.6-23.466667 21.333333-40.533333l-64-196.266667c-4.266667-10.666667-12.8-19.2-25.6-21.333333-12.8-2.133333-23.466667 4.266667-32 12.8C108.8 343.466667 83.2 426.666667 83.2 512c0 236.8 192 428.8 428.8 428.8 66.133333 0 130.133333-14.933333 189.866667-44.8 14.933333-8.533333 21.333333-27.733333 14.933333-42.666667-8.533333-14.933333-27.733333-21.333333-42.666667-14.933333z"
        p-id="60823"
      ></path>
    </svg>
  )
}

RetryIcon.propTypes = {
  size: PropTypes.number
}
