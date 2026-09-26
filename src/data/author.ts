/**
 * The single author entity for everything on this site.
 *
 * Kept in one file on purpose. The value of an author entity comes from it
 * being identical across every post and resolving to a page that genuinely
 * describes whoever it names; a byline that drifts per post, or points at
 * nothing, carries less weight than no byline. `url` must therefore stay a
 * page that actually talks about Kodeblooded — today that is /about/.
 *
 * Spelled "Kodeblooded" rather than all-caps to match how the studio is
 * already written on /about/ and in the kodeblooded.com.ng address. Search
 * engines don't care about the casing; consistency across the site does.
 */
export const AUTHOR = {
  '@type': 'Person' as const,
  name: 'Kodeblooded',
  url: 'https://chakam.site/about/',
};
