
import React from 'react';

interface LogoProps {
    className?: string;
    src?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "h-12 w-auto", src }) => {
    // Fallback for cases where src might not be available during initial load or error
    const defaultLogo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAAQlBMVEX///8A//8AgAAAgIAAgL8AmZkAmf8AmZkAl5cAgIAA//8AgIAA/wAAgIAA/wD//wAAgIAA//8AgL8AgL8AgIAA/wD//zO+g8AAAAAFXRSTlMAESIgM3aImaq7vMy9zN3u7/8/sO9yAAAEi0lEQVR4nO2by5LiMBBFCRd5yR5w/zueU2wSS5aC5U52v0+lB1VlS/bAtsws8n/2V5a/ZACGGASGIRiGQGAIhmEQGAJhmEEgDEYwDAJDMAyDICQYhiEQhsggEAZCMPcQiIAMg2EIBsIgEAZD5A+DIBQGQyAICUZAiBAZBBpBIQwCMQyDIBQyHyZ7GN4/DCAwBMMwCAmGIWQHhGGIQCAIsiEyCAmGIXJgCAaBIGQDySASAhmCIBiGQCAEw2QIDCFD5G4IgiHkAyEIIXwYBFkIgsj/CDQ2g8EgJBmG+B4GEZAhb48Q/yEI5kYcQGQI/L0hCFmI/H1IkL9VR0iQ//d3WUCQn39qI+Q1R6E6CIJAOARCsAgDIfYQB4Q8Rsi/3yOEIUgEAhmCPyI/P+5hCAkRMiCkj+B8Y/FvYfI/gh8R8k+fP/3fQf79e/j5l0eQU8x7kEfI45/PyF/Lz3/xRMgzMgb5A/y+hAh5pD7I/w0MBIQ8z90wCAkQ8t/4+ZcHlEcw5C10Q9/vL0IeiT8M8g/YIeRhyCOh+AciZCHuVQiFkFfE26EaBAl5d3wI/g/ZCDm/v5/3C0fIu8dDeISwCMX/1h3k58/7eR4hQ8hR58hP/g3kIeSX/w9f/jFk/+8pMi8/T/Qh7kEwCAmGIZyP6EMwhCFy+P6eRGAIGUJu/O0+Q/4oH2IQAiFk+PnL19/7e/38/B8b/f8xCMH/HyF/jBCyqR4jZHP9Qhhy+T4g5J8aQyAS8p9/aCLk95/eR4iQv1dHCLJ/e9+38f9RDIK/T4iQ/70fQiIEnm9h/z8Q/h+G5w+DID8hBDL1x2D1m+qPYT2GIYiP2pB70+pP7U2r/6k9E/SfqT/1x6C6359b/ck/a7eF/u+hM2j1n+oPQYj8EwP/g/3579b3/vIuCM13v/pTfz5f+q+6/uSfrb9Xf0aIPyH+3v/yG4Qgf+f/9d8f/iEIhCFIhsEwDIIgCAaBIBiGQBAEQyAMgyAIhkAYBkEQDMEgCILBEAyCIBiGQRCEQRCEgSAIgsEgCILAIAyCIBgEkiAYBEGQCDKIIAgyCCkIhSAE/Zc+xIQQmS9kIXf/m4+QP4T/S9m/kH0YBFk+RB6//j+xQciC8h/D5H8EEZlDyAf5t9c/pD4+b3//+Pnlv4S/kF8/P38+v34J/8X/IeSX/x/4/2IeyS/f+yMkhyB/P18/P39//vI/DIL8+/v5+UaQ/2t+f3//2P79/fN+If8X4g/Z/69/P/8X/v9C/pBvC4IgCCIQhCAIgiEIBsEgmQpBEMw+DIIgwzAIguH3gCCkXw/8fUqG9608QkCImJ8/P/8hP/+H//0e/iHkj7n6+fmff2j/T4KQiAgZ/P4v/0cIkR+B8If+fyE//z/C/hAEYRCEIBGGQSAIQyD7MPg+BMHQHwIhkCAIhSAEw2R/CAZBMAxDMAgCQRCEQSAIhkEQCIIgGIRBEEgEQyAIAiGI5hCCkP8bJCEIgiDIBoIgmQ9DIJCH3x8/hAyh+1/kH/lDkL9/5Bfy9//1Q5D//20IQyAMgyEQgCFkCAwhCMMgyHy5D4eQmD5kCIIgCCF/CHmEDCEIYQhZ//1zD/JDyJAfQiBE+j/28394//3zDyH/v38h5H/+P/z3z3vI//P+C/lD5J/vT3//2hD5h/z/e/+E/P9Pz7+//s//2wT/s+c/2j/8h/x/T8+Qz4//4P+8v28i5Pe/0hAy+f68/88fQv7p1/4u/gO2kK9fM0/u6QAAAABJRU5ErkJggg==';

    return (
        <img 
            src={src || defaultLogo} 
            alt="Logo da Loja" 
            className={className} 
        />
    );
};

export default Logo;
