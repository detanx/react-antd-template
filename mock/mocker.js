/* * @Author: tangxudong
 * @Date: 2020-04-20 10:39:29
 * @Last Modified by: tangxudong
 * @Last Modified time: 2020-04-20 12:09:20
 */
module.exports = {
  'GET /user': {
    data: { name: 'detanx' },
    status: 200,
    msg: 'success!'
  },
  'POST /login/account': (req, res) => {
    const { password, username } = req.body;
    if (password === 'Aa1234' && username === 'admin') {
      return res.send({
        status: 'ok',
        code: 0,
        token: 'sdfsdfsdfdsf',
        data: { id: 1, name: 'detanx' }
      });
    }
    return res.send({ status: 'error', code: 403 });
  }
};
