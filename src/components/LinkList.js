import Link from "./Link";
import { gql, useQuery } from "@apollo/client";
import { useHistory } from "react-router";

const LINKS_PER_PAGE = 10;
export const FEED_QUERY = gql`
  query FeedQuery($take: Int, $skip: Int) {
    feed(take: $take, skip: $skip) {
      count
      links {
        id
        url
        description
        postedBy {
          name
        }
        votes {
          id
        }
      }
    }
  }
`;

const NEW_LINK_SUBSCRIPTIONS = gql`
  subscription {
    newLink {
      id
      url
      description
      votes {
        id
      }
    }
  }
`;

const NEW_VOTES_SUBSCRIPTIONS = gql`
  subscription {
    newVote {
      id
      link {
        id
        url
        description
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
      user {
        id
      }
    }
  }
`;

const LinkList = () => {
  const history = useHistory();
  const isNewPage = history.location.pathname.includes("new");
  const pageIndexParams = history.location.pathname.split("/");
  const page = parseInt(pageIndexParams[pageIndexParams.length - 1]);
  const getQueryVariables = (isNewPage, page) => {
    const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0;
    const take = isNewPage ? LINKS_PER_PAGE : 100;
    return { take, skip };
  };
  const pageIndex = page ? (page - 1) * LINKS_PER_PAGE : 0;

  const { data, loading, error, subscribeToMore } = useQuery(FEED_QUERY, {
    variables: getQueryVariables(isNewPage, page),
  });
  subscribeToMore({ document: NEW_VOTES_SUBSCRIPTIONS });
  subscribeToMore({
    document: NEW_LINK_SUBSCRIPTIONS,
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData.data) return prev;
      const newLink = subscriptionData.data.newLink;
      const exist = prev.feed.links.find(({ id }) => id === newLink.id);
      if (exist) return prev;

      return Object.assign({}, prev, {
        feed: {
          links: [newLink, ...prev.feed],
          count: prev.feed.links.length + 1,
        },
      });
    },
  });

  const getLinksToRender = (isNewPage, data) => {
    if (isNewPage) {
      return data.feed.links;
    }
    const rankedLinks = data.feed.links.slice();
    rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length);
    return rankedLinks;
  };
  return (
    <>
      {loading && <p>Loading...</p>}
      {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
      {data && (
        <>
          {getLinksToRender(isNewPage, data).map((link, index) => (
            <Link key={link.id} link={link} index={index + pageIndex} />
          ))}
          {isNewPage && (
            <div className="flex ml4 mv3 gray">
              <div
                className="pointer mr2"
                onClick={() => {
                  if (page > 1) {
                    history.push(`/news/${page - 1}`);
                  }
                }}
              >
                Previous
              </div>
              <div
                className="pointer"
                onClick={() => {
                  if (page <= data.feed.count / LINKS_PER_PAGE) {
                    const nextPage = page + 1;
                    history.push(`/news/${nextPage}`);
                  }
                }}
              >
                Next
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};
export default LinkList;
