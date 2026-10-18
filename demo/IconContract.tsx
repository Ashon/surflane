// Compile-only public API checks; not imported into the catalog bundle.
import React from "react";
import { Icon } from "@surflane/ui";
const ref = React.createRef<SVGSVGElement>();
<Icon ref={ref} name="search" />;
<Icon name="info" decorative={false} label="Information" />;
// @ts-expect-error Semantic images need an explicit name.
<Icon name="info" decorative={false} />;
// @ts-expect-error Decorative images must not announce a duplicate label.
<Icon name="plus" label="Add" />;
// @ts-expect-error SVG glyphs do not own keyboard focus.
<Icon name="search" tabIndex={0} />;
// @ts-expect-error Vocabulary names are finite.
<Icon name="unknown" />;
