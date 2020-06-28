import generateBallotPdf from './generate-ballot-pdf';
import uploadBallot from './upload-ballot';

export default async function BallotGenerator() {
  const uuid = '123';
  const params =
    'ballotType=estatal&ballotPath=%2Fpapeletas%2F2016%2Fgobernador-y-comisionado-residente&votes=%5B%7B%22column%22%3A2%2C%22row%22%3A2%7D%2C%7B%22column%22%3A1%2C%22row%22%3A4%7D%2C%7B%22column%22%3A0%2C%22row%22%3A0%7D%5D';

  await generateBallotPdf({ uuid, params });
  let url = await uploadBallot(uuid);

  return url;
}

async function test() {
  let url = await BallotGenerator();

  console.log(url);
}

test();
