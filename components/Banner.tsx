'use client';

import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';

const BannerWrapper = styled.div`
    width: 100%;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #000;
    color: white;
    font-size: 24px;
    font-weight: bold;
    padding: 10px;

    @media (max-width: 640px) {
        width: auto;
        font-size: 18px;
        padding: 5px;
    }
`;

interface BannerProps {
    bannerFile?: string;
}

const Banner: React.FC<BannerProps> = ({ bannerFile = 'defaultbanner.svg' }) => (
    <BannerWrapper>
        <Image
            src={`/${bannerFile}`}
            alt="Banner"
            width={500}
            height={200}
            layout="responsive"
        />
    </BannerWrapper>
);

export default Banner;