import { sharedBaseStyle, light, dark } from './sharedStyleLinkButton'

const linkColor = '#483698'
const link = {
  baseStyle: {
    ...sharedBaseStyle,
  },
  sizes: {
    sm: {},
    md: {},
    lg: {},
  },
  variants: {
    ...light,
    ...dark,
    // Add here the shared variants from the sharedStyleLinkButton.js
    thickUnderline: {
      borderBottom: `1px solid ${linkColor}`,
      boxShadow: `inset 0 -7px 0 ${linkColor}`,
      transition: 'all 0.25s ease-in-out',
      paddingTop: '2px 2px 0 2px',
      _hover: {
        backgroundColor: linkColor,
        textDecoration: 'none',
      },
    },
  },
  defaultProps: {
    // size: 'md',
    // variant: 'light',
  },
}

export default link
