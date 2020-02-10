'use strict'

const Task = use('App/Models/Task')
const { validate } = use('Validator')

class TaskController {
  async index({ response, view }) {
    const data = await Task.all()
    return view.render('task.index', {data_: data.toJSON()})
  }
  async create({ request, response, session }) {
    const validasi = await validate(request.all(), {
      title: 'required|min:3|max:255'
    })
    if (validasi.fails()) {
      session.withErrors(validasi.message()).flashAll()
      return response.redirect('back')
    }
    const data = new Task()
    data.title = request.input('title')
    await data.save()

    session.flash({notification: 'Task telah ditambahkan!'})
    return response.redirect('back')
  }
  async delete({ response, params, session }) {
    const task = await Task.find(params.id)
    await task.delete()

    session.flash({notification: 'Task berhasil di hapus!'})
    return response.redirect('back')
  }
}

module.exports = TaskController
