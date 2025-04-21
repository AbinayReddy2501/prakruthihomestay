import React, { useState } from 'react';
import {
  Box,
  Dialog,
  IconButton,
  Typography,
  useTheme,
  DialogContent,
} from '@mui/material';
import {
  Close as CloseIcon,
  NavigateBefore,
  NavigateNext,
} from '@mui/icons-material';

interface ImageGalleryProps {
  images: {
    url: string;
    title: string;
    description: string;
  }[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [open, setOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const theme = useTheme();

  const handleOpen = (index: number) => {
    setCurrentImage(index);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2 }}>
        {images.map((image, index) => (
          <Box
            key={index}
            onClick={() => handleOpen(index)}
            sx={{
              position: 'relative',
              paddingTop: '75%', // 4:3 Aspect Ratio
              cursor: 'pointer',
              overflow: 'hidden',
              borderRadius: 1,
              '&:hover img': {
                transform: 'scale(1.05)',
              },
              '&:hover .overlay': {
                opacity: 1,
              },
            }}
          >
            <img
              src={image.url}
              alt={image.title}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.3s ease',
              }}
            />
            <Box
              className="overlay"
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                bgcolor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                p: 2,
                opacity: 0,
                transition: 'opacity 0.3s ease',
              }}
            >
              <Typography variant="subtitle1">{image.title}</Typography>
            </Box>
          </Box>
        ))}
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth={false}
        sx={{
          '& .MuiDialog-paper': {
            bgcolor: 'background.paper',
            boxShadow: 24,
            width: '90vw',
            height: '90vh',
            m: 2,
          },
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white',
            zIndex: 1,
          }}
        >
          <CloseIcon />
        </IconButton>
        
        <DialogContent
          sx={{
            p: 0,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'black',
          }}
        >
          <IconButton
            onClick={handlePrevious}
            sx={{
              position: 'absolute',
              left: 16,
              color: 'white',
            }}
          >
            <NavigateBefore />
          </IconButton>

          <img
            src={images[currentImage].url}
            alt={images[currentImage].title}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
          />

          <IconButton
            onClick={handleNext}
            sx={{
              position: 'absolute',
              right: 16,
              color: 'white',
            }}
          >
            <NavigateNext />
          </IconButton>

          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              p: 2,
              bgcolor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
            }}
          >
            <Typography variant="h6">{images[currentImage].title}</Typography>
            <Typography variant="body2">{images[currentImage].description}</Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageGallery;
