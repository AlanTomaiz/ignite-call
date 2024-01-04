import { Box, Text, styled } from '@ignite-ui/react'

export const Container = styled(Box, {
  margin: '$6 auto 0',
  padding: 0,

  position: 'relative',
  display: 'grid',
  maxWidth: '100%',

  variants: {
    isTimePickerOpen: {
      true: {
        gridTemplateColumns: '1fr 280px',

        '@media(max-width: 900px)': {
          gridTemplateColumns: '1fr',
        },
      },
      false: {
        width: 540,
        gridTemplateColumns: '1fr',
      },
    },
  },
})

export const TimerPicker = styled('div', {
  borderLeft: '1px solid $gray600',
  padding: '$6 $6 0',
  overflowY: 'auto',

  position: 'absolute',
  top: 0,
  bottom: 0,
  right: 0,
  width: 280,
})

export const TimerPickerHeader = styled(Text, {
  fontWeight: '$medium',

  span: {
    color: '$gray200',
  },
})

export const TimePickerList = styled('div', {
  marginTop: '$3',

  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '$2',

  '@media(max-width: 900px)': {
    gridTemplateColumns: '2fr',
  },
})

export const TimePickerItem = styled('button', {
  border: 0,
  backgroundColor: '$gray600',
  padding: '$2 0',
  color: '$gray100',
  borderRadius: '$sm',
  fontSize: '$sm',
  lineHeight: '$base',
  cursor: 'pointer',

  '&:last-child': {
    marginBottom: '$6',
  },

  '&:disabled': {
    background: 'none',
    opacity: 0.6,
    cursor: 'default',
  },

  '&:not(:disabled):hover': {
    background: '$gray500',
  },

  '&:focus': {
    boxShadow: '0 0 0 1px $colors$gray100',
  },
})
