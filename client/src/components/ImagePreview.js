import React, { useEffect } from 'react';
import './ImagePreview.css';

function ImagePreview({
  imageSrc,
  results,
  canvasRef
}) {

  const getContrastColor = (
    rgb
  ) => {

    if (
      !rgb ||
      !Array.isArray(rgb) ||
      rgb.length < 3
    ) {
      return '#000';
    }

    const [r, g, b] = rgb;

    const brightness =
      (
        r * 299 +
        g * 587 +
        b * 114
      ) / 1000;

    return brightness > 128
      ? '#000'
      : '#FFF';
  };

  useEffect(() => {

    if (
      !imageSrc ||
      !results ||
      !canvasRef.current
    ) {
      return;
    }

    const img =
      new Image();

    img.onload = () => {

      const canvas =
        canvasRef.current;

      const ctx =
        canvas.getContext(
          '2d'
        );

      canvas.width =
        img.width;

      canvas.height =
        img.height;

      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      ctx.drawImage(
        img,
        0,
        0
      );

      results.forEach(
        (item, index) => {

          // Skip invalid items
          if (
            !item ||
            !item.bbox
          ) {

            console.warn(
              'Missing bbox:',
              item
            );

            return;
          }

          const {
            x,
            y,
            width,
            height
          } = item.bbox;

          const bgColor =
            item.backgroundColor ||
            '#FF0000';

          const textColor =
            getContrastColor(
              item.rgb
            );

          // Draw border
          ctx.strokeStyle =
            bgColor;

          ctx.lineWidth = 2;

          ctx.strokeRect(
            x,
            y,
            width,
            height
          );

          // Draw highlight
          ctx.fillStyle =
            bgColor + '33';

          ctx.fillRect(
            x,
            y,
            width,
            height
          );

          const label =
            item.text ||
            'Unknown';

          const fontSize =
            Math.min(
              14,
              Math.max(
                12,
                height * 0.6
              )
            );

          ctx.font =
            `bold ${fontSize}px Arial`;

          const textWidth =
            ctx.measureText(
              label
            ).width;

          const padding = 4;

          const labelY =
            Math.max(
              0,
              y -
                fontSize -
                6
            );

          // Label background
          ctx.fillStyle =
            bgColor;

          ctx.fillRect(
            x,
            labelY,
            textWidth +
              padding * 2,
            fontSize +
              padding
          );

          // Label text
          ctx.fillStyle =
            textColor;

          ctx.textBaseline =
            'top';

          ctx.fillText(
            label,
            x + padding,
            labelY + 2
          );

          // Confidence
          if (
            item.confidence !==
            undefined
          ) {

            const confidenceText =
              `${item.confidence}%`;

            const confWidth =
              ctx.measureText(
                confidenceText
              ).width;

            ctx.fillStyle =
              '#000';

            ctx.fillRect(
              x,
              y +
                height +
                2,
              confWidth +
                8,
              18
            );

            ctx.fillStyle =
              '#FFF';

            ctx.fillText(
              confidenceText,
              x + 4,
              y +
                height +
                4
            );
          }
        }
      );
    };

    img.src = imageSrc;

  }, [
    imageSrc,
    results,
    canvasRef
  ]);

  return (
    <div className="image-preview">
      {imageSrc && (
        <canvas
          ref={canvasRef}
          className="preview-canvas"
        />
      )}
    </div>
  );
}

export default ImagePreview;