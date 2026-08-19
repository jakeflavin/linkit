import styled from 'styled-components'

export const Rail = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 0;
  background: var(--rail);
  border-right: 1px solid var(--line-soft);
`

export const Arrow = styled.button<{ $down?: boolean; $cast?: boolean }>`
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border: 0;
  border-radius: 2px;
  background: none;
  color: var(--dim);

  /* The direction's colour appears on hover and stays once the vote is cast. */
  &:hover {
    background: var(--hover);
    color: ${(props) => (props.$down ? 'var(--down)' : 'var(--up)')};
  }

  ${(props) =>
    props.$cast &&
    `
    color: ${props.$down ? 'var(--down)' : 'var(--up)'};

    & :first-child { fill: currentColor; }
  `}
`

export const Score = styled.span<{ $vote?: number }>`
  font-size: var(--font-meta);
  font-weight: 700;
  font-variant-numeric: tabular-nums;

  ${(props) => props.$vote === 1 && 'color: var(--up);'}
  ${(props) => props.$vote === -1 && 'color: var(--down);'}
`
