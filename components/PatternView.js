import MaskedView from "@react-native-masked-view/masked-view";
import Svg, { Defs, Pattern, Rect, Line, LinearGradient, Stop, G } from "react-native-svg";
import Animated, {
    useSharedValue,
    useAnimatedProps,
    withTiming,
    withRepeat,
} from "react-native-reanimated";
import { useEffect, useMemo } from 'react';
import { View } from "react-native";


const AnimatedG = Animated.createAnimatedComponent(G);


const defaultGridConfig = {
    width: 18,
    height: 18,
    translateX: -1,
    translateY: -1,
    color: '',
    strokeWidth: 0,
    svgWidth: '100%',
    svgHeight: '100%',
    line1: {
        translate: {
            x1: 0, y1: 0, x2: 0, y2: 0
        },
        strokeWidth: 1,
        color: '#7f7f7f',
    },
    line2: {
        translate: {
            x1: 0, y1: 0, x2: 0, y2: 0
        },
        strokeWidth: 1,
        color: '#7f7f7f',
    },
}

const defaultMaskConfig = {
    translateYRange: [-100, 200],
    animate: true,
    duration: 3000,
    opacityKeyframes: {'0%':'0', '25%':'1', '35%':'1', '75%':'0'},
    gradientPosition: {x1: '0', y1: '0.25', x2: '1', y2: '1'},
}

const Mask = ({ config }) => {
    const translateY = useSharedValue(config.translateYRange[0]);

    const animatedProps = useAnimatedProps(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    useEffect(() => {
        if (config.animate)
        {
            translateY.value = config.translateYRange[0];
            translateY.value = withRepeat(withTiming(config.translateYRange[1], { duration: config.duration }), -1, true);
        }
    }, [translateY, config]);

    // The mask element uses an SVG with a linear gradient from opaque (white) to transparent.
    return <Svg height="100%" width="100%">
        <Defs>
            <LinearGradient
                id="maskGradient"
                x1={config.gradientPosition.x1}
                y1={config.gradientPosition.y1}
                x2={config.gradientPosition.x2}
                y2={config.gradientPosition.y2}
            >
                {Object.keys(config.opacityKeyframes)
                    .map((key, index) => {
                        return <Stop key={index} offset={key} stopColor="white" stopOpacity={config.opacityKeyframes[key]} />
                })}
            </LinearGradient>
        </Defs>
        <AnimatedG animatedProps={animatedProps}>
            <Rect width="100%" height="100%" fill="url(#maskGradient)" />
        </AnimatedG>
    </Svg>;
};

const Grid = ({ config }) => {
    return <Svg height={config.svgHeight} width={config.svgWidth}>
        <Defs>
            <Pattern
                id="gridPattern"
                patternUnits="userSpaceOnUse"
                width={config.width}
                height={config.height}
                viewBox={`0 0 ${config.width} ${config.height}`}
            >
                <Line
                    x1={config.line1.translate.x1}
                    y1={config.line1.translate.y1}
                    x2={config.width + config.line1.translate.x2}
                    y2={config.line1.translate.y2}
                    stroke={config.color || config.line1.color}
                    strokeWidth={config.strokeWidth || config.line1.strokeWidth} />
                <Line
                    y1={config.line2.translate.y1}
                    x1={config.line2.translate.x1}
                    x2={config.line2.translate.x2}
                    y2={config.height + config.line2.translate.y2}
                    stroke={config.color || config.line2.color}
                    strokeWidth={config.strokeWidth || config.line2.strokeWidth} />
            </Pattern>
        </Defs>
        <G transform={`translate(${config.translateX}, ${config.translateY})`}>
            <Rect width="100%" height="100%" fill="url(#gridPattern)" />
        </G>
    </Svg>;
};

export default function PatternView({ gridConfig, maskConfig, style, children }) {

    const mergedGridConfig = useMemo(() => ({
        ...defaultGridConfig,
        ...gridConfig,
    }), [gridConfig]);

    const mergedMaskConfig = useMemo(() => ({
        ...defaultMaskConfig,
        ...maskConfig,
    }), [maskConfig]);


    return <View style={[{ flex: 1, backgroundColor: 'black' }, style]}>
        <MaskedView
            style={{ position: 'absolute', width: '100%', height: '100%' }}
            maskElement={<Mask config={mergedMaskConfig}/>}
        >
            <Grid config={mergedGridConfig} />
        </MaskedView>
        {children}
    </View>;
}