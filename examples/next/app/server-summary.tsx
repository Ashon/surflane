import {
  CardBody,
  CardHeader,
  CardRoot,
  CardTitle,
  Container,
  StatLabel,
  StatRoot,
  StatValue,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
} from '@surflane/ui'

const regions = [
  { name: 'Seoul', builds: 42 },
  { name: 'Tokyo', builds: 17 },
]

/** Card, Stat and Table have no client code: they render here and ship no JavaScript. */
export function ServerSummary() {
  return (
    <Container width='reading'>
      <CardRoot>
        <CardHeader>
          <CardTitle>Builds this week</CardTitle>
        </CardHeader>
        <CardBody>
          <StatRoot>
            <StatLabel>Total</StatLabel>
            <StatValue>59</StatValue>
          </StatRoot>
          <TableRoot variant='lined'>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Region</TableHeaderCell>
                <TableHeaderCell align='end'>Builds</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {regions.map((region) => (
                <TableRow key={region.name}>
                  <TableCell>{region.name}</TableCell>
                  <TableCell align='end'>{region.builds}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </TableRoot>
        </CardBody>
      </CardRoot>
    </Container>
  )
}
